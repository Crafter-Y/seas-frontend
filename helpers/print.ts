import { printAsync, printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { Platform } from "react-native";

export const openPrintModal = (html: string) => {
  if (Platform.OS === "web") {
    const iframe = document.createElement("iframe");
    iframe.style.display = "none"; // Hide the iframe
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();

    const closePrint = () => {
      document.body.removeChild(iframe);
    };

    iframe.contentWindow!.onbeforeunload = closePrint;
    iframe.contentWindow!.onafterprint = closePrint;
    iframe.contentWindow!.print();

    return;
  }

  printAsync({
    html,
  }).catch(() => {}); // ignoring rejection (ios rejects on cancel)
};

export const sharePdf = async (html: string) => {
  const { uri } = await printToFileAsync({ html });

  await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
};
