import Label from "./Label";

//This is the custom component which shows the count in a small circular div
const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {
  ////Renders only if provuded the count
  const renderBadge = () => {
    if (!badge) return null;
    return (
      <span className="dark:bg-dark-subtle bg-light-subtle text-white absolute top-0 right-0 translate-x-2 -translate-y-1 text-xs w-5 h-5 rounded-full flex justify-center items-center">
        {badge <= 9 ? badge : "9+" /*if count is grater than 9 print 9+*/}
      </span>
    );
  };

  //renders the count of badge in a small div
  return (
    <div className="relative">
      <Label htmlFor={htmlFor}>{children}</Label>
      {renderBadge()}
    </div>
  );
};

export default LabelWithBadge;
