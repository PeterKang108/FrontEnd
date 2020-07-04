import React from 'react';
import { CTInput, CTFormRow } from 'layout';
import { Button } from 'pico-ui';
import { epub, connectWithRedux } from 'screens/MediaSettings/controllers/epub';
import ChapterImage from '../Step2-EditChapters/ChapterEditor/ChapterImage';

function Toolbar({
  title,
  cover,
  author,
  filename,
  screenshots = [],

  onSaveTitle,
  onSaveCover,
  onSaveAuthor,
  onSaveFilename,
}) {
  const getDownloadOptions = () => ({
    cover,
    title,
    author,
    filename,
  })

  const downloadAsEpub = () => {
    epub.download.asEpub(getDownloadOptions());
  }

  const downloadAsHTML = () => {
    epub.download.asHTML(getDownloadOptions());
  }

  const downloadAsPDF = () => {
    epub.download.asPDF(getDownloadOptions());
  }

  const previewEpub = () => {
    epub.download.asPDF(getDownloadOptions(), false);
  }

  return (
    <div data-scroll className="msp-ee-ech-tb msp-ee-dl-tb ct-a-fade-in">
      <div className="w-100">
        <Button
          round
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon="arrow_back"
          onClick={() => epub.state.toStep(epub.EPUB_STEP_EDIT)}
        >
          Back to Chapter Editor
        </Button>
      </div>

      <hr />

      <h3>File Information</h3>


      <div className="ee-ech-tb-btns">
        <label className="ee-dl-tb-label" htmlFor="ee-dl-tb-cover">Cover Image</label>
        <ChapterImage
          id="ee-dl-tb-cover"
          image={cover}
          screenshots={screenshots}
          onChooseImage={onSaveCover}
        />
      </div>

      <div className="ee-ech-tb-btns ee-dl-file-form">
        <CTFormRow>
          <CTInput
            required // underlined
            label="ePub Title"
            placeholder="ePub title"
            onChange={onSaveTitle}
            value={title}
          />
        </CTFormRow>

        <CTFormRow>
          <CTInput
            required // underlined
            label="Filename"
            placeholder="Filename"
            onChange={onSaveFilename}
            value={filename}
          />
        </CTFormRow>

        <CTFormRow>
          <CTInput
            required // underlined
            label="Author / Instructor"
            placeholder="Author"
            onChange={onSaveAuthor}
            value={author}
          />
        </CTFormRow>
      </div>

      <hr />

      <div className="ee-ech-tb-btns">
        <h3>Preview</h3>
        <Button
          classNames="ee-ech-tb-btn" 
          color="black" 
          icon={<i className="fas fa-external-link-alt" />}
          onClick={previewEpub}
        >
          Preview ePub in HTML
        </Button>

        <hr />
      </div>

      <div className="ee-ech-tb-btns">
        <h3>Download</h3>

        <Button // underlined
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon={<i className="fas fa-file-alt" />}
          onClick={downloadAsEpub}
        >
          Save as ePub (.epub)
        </Button>

        <Button // underlined
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon={<i className="fas fa-file-pdf" />}
          onClick={downloadAsPDF}
        >
          Print/Save as PDF (.pdf)
        </Button>

        <Button // underlined
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon={<i className="fas fa-file-code" />}
          onClick={downloadAsHTML}
        >
          Save as HTML (.html)
        </Button>
      </div>
    </div>
  );
}

export default connectWithRedux(
  Toolbar,
  [],
  [],
  ['media']
);
