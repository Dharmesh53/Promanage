import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";
import { useCallback } from "react";
import { Handle, Position } from "reactflow";

export default function TextBoxNode({ data }) {
  const textareaRef = useRef(null);
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  function adjustHeight() {
    let element = textareaRef.current;
    if (element && element.scrollHeight < 80 * 16) {
      element.style.height = "1px";
      element.style.height = 10 + element.scrollHeight + "px";
    }
  }

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        className={`bg-white border rounded-lg  border-black max-h-[80rem] p-1`}
      >
        <Label htmlFor="text">
          <Textarea
            ref={textareaRef}
            id="text"
            name="text"
            onInput={adjustHeight}
            onChange={onChange}
            className="border-none outline-none w-36 focus-visible:ring-0 p-2 font-normal overflow-auto text-center text-xs resize-none"
          />
        </Label>
      </div>
      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}
