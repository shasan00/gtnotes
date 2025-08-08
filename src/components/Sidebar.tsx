import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const Sidebar = () => {
  return (
    <aside className="w-64 p-4 border-r bg-gt-white">
      <h2 className="text-xl font-semibold mb-4 text-gt-gold">Filters</h2>
      <Accordion type="multiple" defaultValue={["class", "professor", "semester", "type"]} className="w-full">
        <AccordionItem value="class">
          <AccordionTrigger className="text-lg font-medium text-primary hover:no-underline">Class</AccordionTrigger>
          <AccordionContent className="pt-2">
            <Input placeholder="e.g., CS 1301" className="mb-2" />
            {/* Add more class options here, perhaps from a dynamic list */}
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox id="cs1301" />
              <Label htmlFor="cs1301">CS 1301</Label>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox id="math1551" />
              <Label htmlFor="math1551">MATH 1551</Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="professor">
          <AccordionTrigger className="text-lg font-medium text-primary hover:no-underline">Professor</AccordionTrigger>
          <AccordionContent className="pt-2">
            <Input placeholder="e.g., Dr. Smith" className="mb-2" />
            {/* Add more professor options */}
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox id="profsmith" />
              <Label htmlFor="profsmith">Dr. Smith</Label>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox id="profjones" />
              <Label htmlFor="profjones">Prof. Jones</Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="semester">
          <AccordionTrigger className="text-lg font-medium text-primary hover:no-underline">Semester</AccordionTrigger>
          <AccordionContent className="pt-2">
            <Input placeholder="e.g., Fall 2023" className="mb-2" />
            {/* Add more semester options */}
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox id="fall2023" />
              <Label htmlFor="fall2023">Fall 2023</Label>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox id="spring2023" />
              <Label htmlFor="spring2023">Spring 2023</Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="type">
          <AccordionTrigger className="text-lg font-medium text-primary hover:no-underline">Type</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox id="notes" />
              <Label htmlFor="notes">Notes</Label>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox id="exams" />
              <Label htmlFor="exams">Exams</Label>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <Checkbox id="homework" />
              <Label htmlFor="homework">Homework</Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};

export default Sidebar;