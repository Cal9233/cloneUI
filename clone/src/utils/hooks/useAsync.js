import React from 'react';

const useAsync = (asyncFn, onSuccess, setLoading, mapData) => {
  React.useEffect(() => {
    let isMounted = true;
    asyncFn().then(data => {
      if (isMounted) {
        console.log(data);
        onSuccess(mapData(data.data));
        setLoading(false);
      }
    });
    return () => { isMounted = false };
  }, [asyncFn, onSuccess]);
};

export default useAsync;