import infoIcon from '../../assets/images/common/info-icon.svg';
import infoIconWhite from '../../assets/images/common/info-icon-white.svg';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import './CustomTooltip.scss';

const CustomDataTooltip = ({ data }) => {
  return (
    <div style={{ padding: 5 }}>
      <span className="tooltip-span">{data}</span>
    </div>
  );
};

const CustomTooltip = ({ dataTooltip, iconWhite = false }) => {
  return (
    <Tippy
      placement={'bottom-start'}
      theme={'light'}
      content={<CustomDataTooltip data={dataTooltip} />}
    >
      {iconWhite ? (
        <img className="info-icon" src={infoIconWhite} alt="info.svg"></img>
      ) : (
        <img className="info-icon" src={infoIcon} alt="info.svg"></img>
      )}
    </Tippy>
  );
};

export default CustomTooltip;
