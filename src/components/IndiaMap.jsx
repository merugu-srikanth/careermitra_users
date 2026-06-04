import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_india2019High from "@amcharts/amcharts4-geodata/india2019High";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

const IndiaMap = () => {
  useEffect(() => {
    // Apply theme
    am4core.useTheme(am4themes_animated);

    // Create chart
    const chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set India map
    chart.geodata = am4geodata_india2019High;

    // Create polygon series
    const polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    polygonSeries.useGeodata = true;

    // Heat colors (green theme)
    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: am4core.color("#bbf7d0"),
      max: am4core.color("#16a34a"),
    });

    // Sample data
    polygonSeries.data = [
      { id: "IN-MH", value: 100 },
      { id: "IN-UP", value: 80 },
      { id: "IN-AP", value: 60 },
      { id: "IN-TG", value: 70 },
      { id: "IN-KA", value: 90 },
    ];

    // Tooltip + border
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}: {value}";
    polygonTemplate.strokeWidth = 0.5;
    polygonTemplate.stroke = am4core.color("#ffffff");

    // Hover effect (orange)
    const hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#f97316");

    // Cleanup (VERY IMPORTANT in React)
    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div className=" flex items-center justify-center min-h-screen">
      <div id="chartdiv" className="w-full max-w-4xl h-[500px]" />
    </div>
  );
};

export default IndiaMap;