import { TAG_LIST } from '@const/path';
import { TermType } from '@const/types';
import Link from 'next/link';

type Props = {
  items: TermType[];
};

export default function Tags(props: Props) {
  const { items } = props;

  return (
    <ul className="pm-main-tag">
      {items?.map((item) => (
        <li key={item._id} className="pm-main-tag-item">
          <Link href={`/${TAG_LIST}/${item?.term_slug}`}>
            <a title={item?.term_name}>{item?.term_name}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
