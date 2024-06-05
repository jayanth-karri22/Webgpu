import $ from "jquery";
import { CheckWebGPU } from "./helper";
import { shaders } from "./shaders";

async function main() {
    try {
       const {device} =  await CheckWebGPU();
        const canvas = document.getElementById("canvas-webgpu") as HTMLCanvasElement
        const context = canvas?.getContext('webgpu');
        const presentationFormat = navigator?.gpu?.getPreferredCanvasFormat();
        context?.configure({
            device,
            format: presentationFormat
        });
        const module = device.createShaderModule({
            label: 'A red triangle',
            code: shaders
        });

        const pipeline = device.createRenderPipeline({
            label: 'Red triangle pipeline',
            layout: 'auto',
            vertex: {
                // entryPoint: 'vs', As only one function it defaults to this
                module
            },
            fragment: {
                // entryPoint: 'fs', As only one function it defaults to this
                module,
                targets: [{format: presentationFormat}]
            }
        })

        const renderPassDescriptor: any = {
            label: 'Canvas renderpass',
            colorAttachments: [
                {
                    // view: undefined,
                    clearValue: [0.3, 0.3, 0.3, 1],
                    loadOp: 'clear',
                    storeOp: 'store'
                }
            ]
        }

        const render = () => {
            renderPassDescriptor.colorAttachments[0].view = context?.getCurrentTexture().createView();
            const encoder = device.createCommandEncoder({ label: 'our encoder' });
            const pass = encoder.beginRenderPass(renderPassDescriptor);
            pass.setPipeline(pipeline);
            pass.draw(3);
            pass.end();

            const commandBuffer = encoder.finish();
            device.queue.submit([commandBuffer]);
        }

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
              const canvas = entry.target as HTMLCanvasElement;
              const width = entry.contentBoxSize[0].inlineSize;
              const height = entry.contentBoxSize[0].blockSize;
              canvas.width = Math.max(1, Math.min(width, device.limits.maxTextureDimension2D));
              canvas.height = Math.max(1, Math.min(height, device.limits.maxTextureDimension2D));
              // re-render
              render();
            }
          });
          observer.observe(canvas);

    } catch (error) {
        console.error(error);
        $("body").append(`<h1>${error}</h1>`);
    }
}

main();