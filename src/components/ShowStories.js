import React, { useState } from 'react';
import Story from './Story';
import useDataFetcher from '../hooks/dataFetcher';

const ShowStories = ({ type }) => {
  const [page, setPage] = useState(1);
  const [storiesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const { isLoading, stories } = useDataFetcher(type ? type : 'top', page);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (event) => {
    setSortBy(event.target.value);
  };

  const filteredStories = stories
    .filter((story) => {
      return story.data.title.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.data.created_at) - new Date(a.data.created_at);
      }
      return b.data.num_comments - a.data.num_comments;
    });

  const indexOfLastStory = page * storiesPerPage;
  const indexOfFirstStory = indexOfLastStory - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirstStory, indexOfLastStory);

  return (
    <React.Fragment>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search stories by keyword"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select value={sortBy} onChange={handleSort}>
          <option value="date">Sort by date</option>
          <option value="comments">Sort by number of comments</option>
        </select>
      </div>
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <React.Fragment>
          {currentStories.map(({ data: story }) => (
            <Story key={story.id} story={story} />
          ))}
          <div className="pagination">
            {page > 1 && (
              <button className="prev-page" onClick={handlePrevPage}>
                Prev
              </button>
            )}
            {indexOfLastStory < filteredStories.length && (
              <button className="next-page" onClick={handleNextPage}>
                Next
              </button>
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ShowStories;
