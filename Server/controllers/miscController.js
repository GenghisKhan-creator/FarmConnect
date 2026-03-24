import prisma from '../config/db.js';

export const getReports = async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      include: { reportedUser: { select: { name: true } }, reporter: { select: { name: true } } }
    });
    res.json(reports.map(r => ({
      ...r,
      reportedUserName: r.reportedUser.name,
      reporterName: r.reporter.name
    })));
  } catch (err) { res.status(500).json({ message: 'Error fetching' }); }
};

export const createReport = async (req, res) => {
  try {
    const { reportedUserId, reason } = req.body;
    const report = await prisma.report.create({
      data: { reportedUserId, reporterId: req.user.id, reason },
      include: { reportedUser: { select: { name: true } }, reporter: { select: { name: true } } }
    });
    res.status(201).json({ ...report, reportedUserName: report.reportedUser.name, reporterName: report.reporter.name });
  } catch (err) { res.status(500).json({ message: 'Error creating report' }); }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
    res.json(notifications);
  } catch (err) {
    console.error("GET_NOTIFICATIONS ERR:", err);
    res.status(500).json({ message: 'Error fetching notifications' }); 
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: req.user.id }, { receiverId: req.user.id }] },
      orderBy: { timestamp: 'asc' },
      include: {
        sender: { select: { id: true, name: true, farmName: true, role: true } },
        receiver: { select: { id: true, name: true, farmName: true, role: true } }
      }
    });
    res.json(messages);
  } catch (err) {
    console.error("GET_MESSAGES ERR:", err);
    res.status(500).json({ message: 'Error fetching messages' }); 
  }
};

export const createMessage = async (req, res) => {
  try {
    const { receiverId, message, conversationId } = req.body;
    const msg = await prisma.message.create({
      data: { senderId: req.user.id, receiverId, message, conversationId },
      include: {
        sender: { select: { id: true, name: true, farmName: true, role: true } },
        receiver: { select: { id: true, name: true, farmName: true, role: true } }
      }
    });

    await prisma.notification.create({
      data: { userId: receiverId, type: 'message', text: 'You have a new message.' }
    });
    
    // Broadcast via WebSockets to the receiver
    if (req.io && req.connectedUsers) {
      const receiverSocketId = req.connectedUsers.get(receiverId);
      if (receiverSocketId) {
        req.io.to(receiverSocketId).emit('receive_message', msg);
      }
    }

    res.status(201).json(msg);
  } catch (err) {
    console.error("CREATE_MESSAGE ERR:", err);
    res.status(500).json({ message: 'Error creating message' }); 
  }
};

const presenceCache = new Map();

export const handlePresence = (req, res) => {
  const { typingTo, queryIds } = req.body;
  
  // Update current user's presence
  presenceCache.set(req.user.id, { 
    lastSeen: new Date(), 
    typingTo: typingTo || null 
  });
  
  // Formulate response
  const result = {};
  const now = new Date();
  
  if (queryIds && Array.isArray(queryIds)) {
    queryIds.forEach(id => {
      if (id === req.user.id) return;
      const p = presenceCache.get(id);
      if (p) {
        const isOnline = (now - p.lastSeen) < 15000; // 15s online threshold
        result[id] = {
          lastSeen: p.lastSeen,
          isOnline,
          isTyping: isOnline && p.typingTo === req.user.id
        };
      } else {
        result[id] = { lastSeen: null, isOnline: false, isTyping: false };
      }
    });
  }
  
  res.json(result);
};
