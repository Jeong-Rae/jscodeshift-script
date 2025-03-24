import PropTypes from "prop-types";

const Foo = ({ bar }) => {
    return <div>{bar}</div>;
};

Foo.propTypes = {
    bar: PropTypes.string,
};

Foo.defaultProps = {
    bar: "bar",
};

export default Foo;
