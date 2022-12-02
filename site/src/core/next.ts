import { getCommonOptions } from '@models/optionsModel';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';

type PropsContext = GetStaticPropsContext | GetServerSidePropsContext;
type Settings = {
  type?: 'website' | 'article';
  title?: string;
  description?: string;
  image?: string;
  sidebar?: boolean;
  robotsIndex?: boolean;
  robotsFollow?: boolean;
};

export const getCommonData = async (context: PropsContext, settings?: Settings) => {
  const {
    type = 'website',
    title = '',
    description = '',
    image = '',
    sidebar = false,
    robotsIndex = true,
    robotsFollow = true,
  } = settings || {};

  const options = await getCommonOptions();

  return {
    options,
    type,
    title,
    description,
    image,
    sidebar,
    robotsIndex,
    robotsFollow,
  };
};

export default {};
