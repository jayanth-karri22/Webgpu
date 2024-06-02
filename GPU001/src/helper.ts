export const CheckWebGPU = () => {
  if (!navigator.gpu) {
    throw new Error("WebGPU is not supported in your browser");
  }
  return "WebGPU is supported in your browser";
};
