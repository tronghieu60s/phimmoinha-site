import logoDark from '@assets/images/logo-dark.png';
import { OptionMenuType } from '@const/types';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
  logo: string;
  menu: OptionMenuType[];
  copyright: string;
  title?: string;
};

export default function Footer(props: Props) {
  const { logo, menu, copyright, title } = props;

  const logoImage = logoDark || logo;

  return (
    <footer className="pm-footer">
      <div className="pm-container">
        <div className="pm-footer-content">
          <div className="pm-footer-column">
            <div className="pm-footer-logo">
              <Link href="/">
                <a title={title}>
                  <Image src={logoImage} alt="Logo" width={200} height={80} layout="responsive" />
                </a>
              </Link>
            </div>
          </div>
          {menu?.map((o) => (
            <div key={o._id} className="pm-footer-column">
              <h2 className="pm-footer-heading">{o?.menu_title}</h2>
              <ul className="pm-footer-menu">
                {o?.menu_content?.map((o2) => (
                  <li key={o2._id} className="pm-footer-menu-item">
                    <Link href={o2?.menu_path || '#'}>
                      <a title={o2?.menu_title}>{o2?.menu_title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="pm-footer-copyright">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: copyright }} />
      </div>
    </footer>
  );
}
