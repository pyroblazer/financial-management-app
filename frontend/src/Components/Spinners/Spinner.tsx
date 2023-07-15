import React from 'react';
import { ClipLoader } from 'react-spinners';

type Props = {
  isLoading?: boolean;
};

const Spinner = ({ isLoading = true }: Props) => {
  return (
    <div id="loading-spinner" className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <ClipLoader
        className="bg-purple"
        loading={isLoading}
        size={35}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Spinner;