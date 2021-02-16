import download from 'js-file-download';
import { prompt } from 'utils/prompt';
import { EPubFileBuilder, HTMLFileBuilder, ScreenshotsBuilder } from './file-builders';

const _download = async (Builder, filenameSuffix) => {
  const { epub } = window.temp_app._store.getState();
  const filename = epub.epub.filename + filenameSuffix;
  const fileBuffer = await Builder.toBuffer(epub);
  download(fileBuffer, filename);
};

const _logError = (error) => {
  prompt.addOne({
    text: `Error: ${error.message}`,
    status: 'error',
    position: 'bottom left',
    timeout: -1
  });
};

class EPubDownloadController {
  static async downloadEPub(onDownloaded) {
    try {
      await _download(EPubFileBuilder, '.epub');
      if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }

  static async downloadHTML(onDownloaded) {
    try {
      await _download(HTMLFileBuilder, '.zip');
      if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }

  static preview(print = false) {
    try {
      const { epub } = window.temp_app._store.getState();
      const builder = new HTMLFileBuilder(epub, true);
      const html = builder.getIndexHTML(true, print);
      const htmlBlob = new Blob([html], { type: 'text/html' });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      window.open(htmlUrl, '_blank');
    } catch (error) {
      _logError(error);
    }
  }

  static async downloadPDF(onDownloaded) {
    EPubDownloadController.preview(true);
  }

  static async downloadScreenshots(onDownloaded) {
    try {
      await _download(ScreenshotsBuilder, ' - Screenshots.zip');
      if (typeof onDownloaded === 'function') onDownloaded();
    } catch (error) {
      _logError(error);
    }
  }
}

export default EPubDownloadController;