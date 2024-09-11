import GizLogo from '../../../assets/images/partners/giz.svg';
import ArshedLogo from '../../../assets/images/partners/arshed.svg';
import BiharLogo from '../../../assets/images/partners/bihar.svg';
import daLogo from '../../../assets/images/partners/da.svg';
import gmdaLogo from '../../../assets/images/partners/gmda.svg';
import lacunaLogo from '../../../assets/images/partners/lacuna.svg';
import misteoLogo from '../../../assets/images/partners/misteo.svg';
import nottinghamLogo from '../../../assets/images/partners/nottingham.svg';
import undpLogo from '../../../assets/images/partners/undp.svg';

const OurPartners = () => {
  const partnersData = [
    {
      id: 1,
      name: 'GIZ',
      logo: GizLogo,
    },
    {
      id: 2,
      name: 'Lacuna',
      logo: lacunaLogo,
    },
    {
      id: 3,
      name: 'Bihar',
      logo: BiharLogo,
    },
    {
      id: 4,
      name: 'GMDA',
      logo: gmdaLogo,
    },
    {
      id: 5,
      name: 'Misteo',
      logo: misteoLogo,
    },
    {
      id: 6,
      name: 'Arshed',
      logo: ArshedLogo,
    },
    {
      id: 7,
      name: 'Nottingham',
      logo: nottinghamLogo,
    },

    {
      id: 8,
      name: 'DA',
      logo: daLogo,
    },

    {
      id: 9,
      name: 'UNDP',
      logo: undpLogo,
    },
  ];

  return (
    <div className="w-full flex justify-center items-start flex-col">
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-screen-lg">
          {partnersData.map((partner) => (
            <div
              key={partner.id}
              className="flex justify-center items-center p-4 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-32 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurPartners;
