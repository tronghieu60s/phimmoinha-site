import logoDark from '@assets/images/logo-dark.png';
import { SEARCH_LIST } from '@const/path';
import { OptionMenuType } from '@const/types';
import useTranslation from 'next-translate/useTranslation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useCallback } from 'react';
import { Search } from 'react-feather';

type Props = {
  logo: string;
  menu: OptionMenuType[];
  title?: string;
};

export default function Header(props: Props) {
  const { logo, menu, title } = props;
  const { t } = useTranslation();
  const router = useRouter();

  const logoImage = logoDark || logo;

  const onSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push(`/${SEARCH_LIST}/${e.currentTarget.search.value}`);
    },
    [router],
  );

  return (
    <header className="pm-header">
      <div className="pm-container">
        <nav className="pm-header-navbar">
          <div className="pm-header-logo">
            <Link href="/">
              <a title={title}>
                <Image src={logoImage} alt={title} width={200} height={80} layout="responsive" />
              </a>
            </Link>
          </div>
          <ul className="pm-header-menu">
            {menu?.map((o) => (
              <li key={o._id} className="pm-header-menu-item">
                {o?.menu_content ? (
                  <a href="#" title={o?.menu_title} onClick={(e) => e.preventDefault()}>
                    {o?.menu_title}
                  </a>
                ) : (
                  <Link href={o?.menu_path || '#'}>
                    <a title={o?.menu_title}>{o?.menu_title}</a>
                  </Link>
                )}
                {o?.menu_content && (
                  <ul className="pm-header-menu-item-dropdown">
                    {o?.menu_content?.map((o2) => (
                      <li key={o2._id} className="pm-header-menu-item-dropdown-item">
                        <Link href={o2?.menu_path || '#'}>
                          <a title={o2?.menu_title}>{o2?.menu_title}</a>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <form className="pm-header-search" onSubmit={onSearch}>
            <button type="submit" className="pm-header-search-button" aria-label="button">
              <Search color="#cccccc" size={15} />
            </button>
            <input
              type="text"
              name="search"
              className="pm-header-search-input"
              placeholder={t('common:search.placeholder')}
              autoComplete="off"
            />
          </form>
        </nav>
      </div>
    </header>
  );
}
