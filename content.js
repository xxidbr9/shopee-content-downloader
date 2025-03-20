async function fetchBlob(url) {
  try {
    const response = await fetch(url);
    return await response.blob();
  } catch (error) {
    console.error("Failed to fetch:", url, error);
    return null;
  }
}

async function saveFile(blob, filename) {
  // sent to background.js
  chrome.runtime.sendMessage({
    action: "download",
    url: URL.createObjectURL(blob),
    filename
  });
}

async function downloadFiles() {
  console.log("Downloading files...");
  // Define folder name
  let folder = "shopee_download"; // Simulates a folder in Downloads
  // change the folder based on  https://shopee.co.id/product/90164996/26329301625?share_channel_code=1&uls_trackid=528vn0c600eu
  // last id
  // 26329301625

  // ignore ?
  folder = "shopee_download/" + window.location.pathname.split("/").pop().split("?")[0];
  document?.querySelector("picture")?.click();
  // todo: await some time for the image to load
  await new Promise(resolve => setTimeout(resolve, 1000));
  // 1️⃣ Download the first video
  const video = document.querySelector("video");
  if (video && video.src) {
    console.log("video.src", video.src);
    const videoBlob = await fetchBlob(video.src);
    if (videoBlob) {
      await saveFile(videoBlob, `${folder}/video.mp4`);
    }
  }

  console.log("Downloading images...");

  // XPath dialog
  /* //*[@id="modal"]/div[3]/div[1] */
  // 2️⃣ Download images with "@resize_w82_nl.webp"

  // require to only select all images in the dialog
  const dialogElement = document?.querySelector('div[role="dialog"].NDTw5b');

  console.log("dialog", dialogElement);
  // const images = dialogElement ? dialogElement.querySelectorAll("img") : [];

  // only select that are: img.uXN1L5.lazyload.raRnQV
  const images = dialogElement?.querySelectorAll("img.uXN1L5.lazyload.raRnQV");

  const imagePromises = Array?.from(images)?.map(async (img, index) => {
    const fixedUrl = img.src + ".webp";
    const imgBlob = await fetchBlob(fixedUrl);
    if (imgBlob) {
      const filename = `${folder}/image_${index}.jpg`;
      await saveFile(imgBlob, filename);
    }
  });

  console.log("images", images);
  document?.querySelector(".dqUa8V")?.click();
  await Promise.all(imagePromises);
}

// Start process
downloadFiles();

