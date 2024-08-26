import { registerLanguage } from './registration';

registerLanguage({
  id: 'nat',
  extensions: ['.nat',],
  aliases: ['nat', 'natlang'],
  loader: () => {
    return import('./nat');
  }
});