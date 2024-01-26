import React from "react";

const PrintArray = ({ arr }: { arr: any[] }) => {
  return (
    <>
      {arr.map((i, ind) => (
        <React.Fragment key={ind}>{i}</React.Fragment>
      ))}
    </>
  );
};

export default PrintArray;
