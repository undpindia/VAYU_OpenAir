import { Button as BootstrapBtn } from 'react-bootstrap';
import PropTypes from 'prop-types';

const Button = ({ label, variant, ...props }) => {
  return (
    <BootstrapBtn variant={variant} {...props}>
      {label}
    </BootstrapBtn>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
};

export default Button;
