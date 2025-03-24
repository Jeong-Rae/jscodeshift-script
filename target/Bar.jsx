import React from "react";
import PropTypes from "prop-types";

const Bar = ({ className, userId }) => {
    return <div className={className}>User ID: {userId}</div>;
};

Bar.propTypes = {
    className: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
};

Bar.defaultProps = {
    userId: "123",
};

export default Bar;
