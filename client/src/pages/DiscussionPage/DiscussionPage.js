import React from 'react';
import CommentSection from '../../components/CommentSection/CommentSection';
import './DiscussionPage.css';

const DiscussionPage = ({ notify }) => {
  return (
    <main className="discussion-page">
      <h2>Общий чат книжного клуба</h2>
      <p className="discussion-desc">Здесь вы можете обсуждать любые темы, делиться впечатлениями о прочитанном и рекомендовать книги другим участникам.</p>
      
      <div className="discussion-container">
        <CommentSection bookId="general" notify={notify} />
      </div>
    </main>
  );
};

export default DiscussionPage;
