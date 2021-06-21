import { guid } from "@/scripts/util";

self.onmessage = ({ data: { question } }) => {
  self.postMessage({
    answer: guid(),
  });
};