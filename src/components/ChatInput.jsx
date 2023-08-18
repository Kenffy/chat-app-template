import "../assets/css/chatinput.css";
import { v4 as getID } from "uuid";

export const ChatInput = ({
  onMedia,
  message,
  medias,
  setMessage,
  setOnMedia,
  setMedias,
  handleCreate,
}) => {
  const handleImages = (e) => {
    const files = e.target.files;
    let count = 0; //counter;
    const maxUpload = 4;
    for (let i = 0; i < files.length; i++) {
      if (count < maxUpload) {
        const id = getID();
        const newImage = {
          id: id,
          filename: id + "-" + files[i].name,
          file: files[i],
        };
        setMedias((prev) => ({ ...prev, images: [...prev.images, newImage] }));
        count = count + 1;
      }
    }
    //setCounter(count);

    setOnMedia(false);
  };

  const handleAudios = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const newAudio = {
        filename: getID() + "-" + file.name,
        file: file,
        type: "audio",
      };
      setMedias((prev) => ({ ...prev, audio: newAudio }));
    }

    setOnMedia(false);
  };

  const handleDocs = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const newDocument = {
        filename: getID() + "-" + file.name,
        file: file,
        type: "document",
      };
      setMedias((prev) => ({ ...prev, document: newDocument }));
    }
    setOnMedia(false);
  };

  const handleRemoveImage = (id) => {
    if (medias?.images?.length > 0) {
      setMedias((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img.id !== id),
      }));
      //setCounter((prevState)=> prevState - 1);
    }
  };

  const handleRemoveAudio = () => {
    setMedias((prev) => ({
      ...prev,
      audio: null,
    }));
  };

  const handleRemoveDoc = () => {
    setMedias((prev) => ({
      ...prev,
      document: null,
    }));
  };
  return (
    <div className="chat-input">
      {(medias?.images?.length > 0 || medias?.audio || medias?.document) && (
        <div className="media-preview">
          {medias?.images.length > 0 && (
            <div className="image-preview">
              {medias.images.map((image) => (
                <div className="image-item" key={image?.id}>
                  <img src={URL.createObjectURL(image?.file)} alt="" />
                  <i
                    onClick={() => handleRemoveImage(image?.id)}
                    className="fa-solid fa-rectangle-xmark"
                  ></i>
                </div>
              ))}
            </div>
          )}

          {medias?.audio && (
            <div className="file-wrapper">
              <span className="file-name">{medias.audio?.file.name}</span>
              <span onClick={handleRemoveAudio}>
                <i className="fa-solid fa-rectangle-xmark"></i>
              </span>
            </div>
          )}

          {medias?.document && (
            <div className="file-wrapper">
              <span className="file-name">{medias.document?.file.name}</span>
              <span onClick={handleRemoveDoc}>
                <i className="fa-solid fa-rectangle-xmark"></i>
              </span>
            </div>
          )}
        </div>
      )}

      <div
        className={onMedia ? "input-icon active" : "input-icon"}
        onClick={() => setOnMedia((prev) => !prev)}
      >
        <i className="fa-solid fa-plus"></i>
      </div>
      <>
        {onMedia && (
          <div className="media-input-wrapper">
            <label className="media-item" htmlFor="upload-images">
              <input
                style={{ display: "none" }}
                accept=".jpg,.jpeg,.png"
                id="upload-images"
                type="file"
                multiple
                onChange={handleImages}
              />
              <i className="fa-solid fa-camera"></i>Fotos
            </label>

            <label className="media-item" htmlFor="upload-audios">
              <input
                style={{ display: "none" }}
                accept=".mp3,.ogg"
                id="upload-audios"
                type="file"
                onChange={handleAudios}
              />
              <i className="fa-solid fa-headphones"></i>Audio
            </label>
            <label className="media-item" htmlFor="upload-documents">
              <input
                style={{ display: "none" }}
                accept=".txt,.pdf"
                id="upload-documents"
                type="file"
                onChange={handleDocs}
              />
              <i className="fa-solid fa-file"></i>Document
            </label>
          </div>
        )}
      </>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message"
      ></textarea>
      <div className="input-icon" onClick={handleCreate}>
        <i className="fa-solid fa-paper-plane"></i>
      </div>
    </div>
  );
};
