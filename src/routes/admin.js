// Content moderation endpoints
router.get('/moderation-queue', async (req, res) => {
  try {
    const queue = await ContentModerationQueue.find({ status: 'pending' })
      .sort({ reportedAt: -1 })
      .populate('reportedBy', 'name')
      .populate('contentOwner', 'name')
      .lean();
      
    res.json(queue);
  } catch (err) {
    console.error('Moderation queue error:', err);
    res.status(500).json({ message: 'Failed to load moderation queue' });
  }
});

router.post('/moderation/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ContentModerationQueue.findByIdAndUpdate(
      id,
      { status: 'approved', reviewedBy: req.user.id, reviewedAt: new Date() },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Restore content if needed
    // contentService.restoreContent(item.contentId);
    
    res.json({ message: 'Content approved' });
  } catch (err) {
    console.error('Approve content error:', err);
    res.status(500).json({ message: 'Failed to approve content' });
  }
});

router.post('/moderation/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await ContentModerationQueue.findByIdAndUpdate(
      id,
      { status: 'rejected', reviewedBy: req.user.id, reviewedAt: new Date() },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    // Remove content if needed
    // contentService.removeContent(item.contentId);
    
    res.json({ message: 'Content rejected' });
  } catch (err) {
    console.error('Reject content error:', err);
    res.status(500).json({ message: 'Failed to reject content' });
  }
});