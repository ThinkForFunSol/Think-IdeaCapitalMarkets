import React, { useState } from 'react';

interface CommentSectionProps {
  ideaId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ ideaId }) => {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Mock: Load from localStorage
    const saved = localStorage.getItem(`comments_${ideaId}`);
    if (saved) setComments(JSON.parse(saved));
  }, [ideaId]);

  const addComment = () => {
    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(`comments_${ideaId}`, JSON.stringify(updated));
    setNewComment('');
  };

  return (
    <div>
      <h4>Comments</h4>
      {comments.map((c, i) => <p key={i}>{c}</p>)}
      <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
      <button onClick={addComment}>Add Comment</button>
    </div>
  );
};

export default CommentSection;
