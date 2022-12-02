import Alert from '@common/Base/Alert';
import Breadcrumb from '@common/Base/Breadcrumb';
import Heading from '@common/Base/Heading';
import Section from '@common/Base/Section';
import FilmsList from '@components/Films/List';
import { BreadcrumbType, MovieType, PaginationType } from '@const/types';

type Props = {
  movies: MovieType[];
  pagination: PaginationType;
  headingText: string;
  breadcrumb: BreadcrumbType[];
  keywordText?: string;
};

export default function FilmContainer(props: Props) {
  const { movies, pagination, headingText, keywordText, breadcrumb } = props;

  return (
    <>
      <Section>
        <Breadcrumb items={breadcrumb} />
        <Heading>{headingText}</Heading>
        {keywordText && <Alert dangerouslySetInnerHTML={{ __html: keywordText }} />}
      </Section>
      <FilmsList items={movies} pagination={pagination} showSuggestion />
    </>
  );
}
