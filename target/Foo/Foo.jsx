import React, { Component } from "react";
import PropTypes from "prop-types";

class Foo extends Component {
    render() {
        const { className, userId } = this.props;

        return <div className={className}>User ID: {userId}</div>;
    }
}

Foo.propTypes = {
    className: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
};

export default Foo;
