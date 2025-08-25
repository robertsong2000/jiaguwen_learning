import React from 'react';
import { useParams } from 'react-router-dom';
import CharacterExplorer from '../components/CharacterExplorer/CharacterExplorer';

const ExplorePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="explore-page">
      <CharacterExplorer />
    </div>
  );
};

export default ExplorePage;