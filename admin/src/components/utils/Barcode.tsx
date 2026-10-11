"use client";

import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

interface BarcodeProps {
  value: string;
  className?: string;
  options?: any;
}

export const Barcode: React.FC<BarcodeProps> = ({ value, className, options }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          displayValue: true,
          ...options,
        });
      } catch (error) {
        console.error("Failed to render barcode:", error);
      }
    }
  }, [value, options]);

  if (!value) return null;

  return <svg ref={svgRef} className={className}></svg>;
};
