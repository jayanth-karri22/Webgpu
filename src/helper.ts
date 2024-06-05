export const CheckWebGPU = async () => {

  const adapter = await navigator?.gpu?.requestAdapter();
  const device = await adapter?.requestDevice();

  if (!device) {
    throw new Error("WebGPU is not supported in your browser");
  }
  return { adapter, device}
};
