import PropTypes from "prop-types";

const Foo = ({ bar = "bar" }) => {
    return <div>{bar}</div>;
};

Foo.propTypes = {
    bar: PropTypes.string,
};

export default Foo;
