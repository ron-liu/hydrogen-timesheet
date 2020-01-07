import HummusRecipe from "hummus-recipe";
import { CreateTimeSpanParams } from "./time-span";
import { Timesheet } from "./timesheet";

const fillForm = (config: Config) => (timesheet: Timesheet) => {
  const pdfDoc = new HummusRecipe("./template.pdf", "./output.pdf");
  generateActions(config)
    .reduce((prev, act) => act(prev), pdfDoc.editPage(1))
    .endPage()
    .endPDF();
  console.log("done");
};

const generateActions = (
  config: Config
): Array<(x: HummusRecipe) => HummusRecipe> => {
  const { client, consultant, reportTo } = config;
  return [
    p => p.text(consultant.name, 140, 106, { color: BLACK, size: 20 }),
    p => p.text(client, 140, 152, { color: BLACK, size: 20 }),
    p =>
      p.text(consultant.purchaseOrderNumber, 450, 152, {
        color: BLACK,
        size: 20
      }),
    p => p.text(consultant.name, 130, 611, { color: BLACK, size: 16 }),
    p => p.text(consultant.position, 130, 650, { color: BLACK, size: 16 }),
    p => p.text(reportTo.name, 130, 688, { color: BLACK, size: 16 }),
    p => p.text(reportTo.name, 393, 611, { color: BLACK, size: 16 }),
    p => p.text(reportTo.position, 393, 650, { color: BLACK, size: 16 }),
    p => p.text("N/A", 393, 688, { color: BLACK, size: 16 })
  ];
};

const BLACK = [0, 0, 0];

fillForm({
  consultant: {
    name: "Ron Liu",
    position: "Dev",
    purchaseOrderNumber: "100342"
  },
  client: "Seek",
  reportTo: { name: "Jamie Matcalfe", position: "DM" },
  defaultTimeSpan: {
    start: new Date(8 * 3600 * 1000),
    end: new Date(16.5 * 3600 * 1000),
    breaks: new Date(0.5 * 3600 * 1000)
  }
})({});

type Config = {
  consultant: {
    name: string;
    position: string;
    purchaseOrderNumber: string;
  };
  reportTo: {
    name: string;
    position: string;
  };
  client: string;
  defaultTimeSpan: CreateTimeSpanParams;
};
