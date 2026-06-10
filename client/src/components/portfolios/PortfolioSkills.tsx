import React, { useState, memo } from "react";
import Input from "../Input";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaGripVertical, FaRegTrashAlt, FaPlus } from "react-icons/fa";
import { PortfolioSkill } from "@/types/portfolio";
import Select from "../Select";

const SortableSkillCategoryItem = memo(
  ({
    skill,
    index,
    editingId,
    setEditingId,
    updateSkill,
    removeSkill,
  }: {
    skill: PortfolioSkill;
    index: number;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    updateSkill: (
      index: number,
      field: string,
      value: string | string[],
    ) => void;
    removeSkill: (index: number) => void;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: `skill-${index}`,
        disabled: editingId === `skill-${index}`,
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex gap-2 items-center">
          <button
            {...attributes}
            {...listeners}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing -mt-6"
          >
            <FaGripVertical />
          </button>
          <Input
            type="text"
            placeholder="Skill name"
            value={skill.name}
            onFocus={() => setEditingId(`category-${index}`)}
            onBlur={() => setEditingId(null)}
            onChange={(e) => updateSkill(index, "name", e.target.value)}
          />
          <Select
            value={skill.proficiency}
            onChange={(e) => updateSkill(index, "proficiency", e.target.value)}
            name={"proficiency"}
            options={[
              { value: "beginner", label: "Beginner" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
              { value: "expert", label: "Expert" },
            ]}
          />
          <button
            onClick={() => removeSkill(index)}
            className="text-red-500 hover:text-red-700 -mt-6"
          >
            <FaRegTrashAlt />
          </button>
        </div>
      </div>
    );
  },
);

SortableSkillCategoryItem.displayName = "SortableSkillCategoryItem";

type PortfolioSkillsProps = {
  skills: PortfolioSkill[];
  setSkills: React.Dispatch<React.SetStateAction<PortfolioSkill[]>>;
};

const PortfolioSkills = ({ skills, setSkills }: PortfolioSkillsProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const addSkillCategory = () => {
    setSkills((prev) => [
      ...prev,
      {
        name: "",
        isNew: true,
        proficiency: "intermediate",
      },
    ]);
  };

  const updateSkillCategory = (
    index: number,
    field: string,
    value: string | string[],
  ) => {
    setSkills((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, [field]: value } : cat)),
    );
  };

  const removeSkillCategory = (index: number) => {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSkills((prev) => {
      const oldIndex = parseInt(active.id.toString().split("-")[1]);
      const newIndex = parseInt(over.id.toString().split("-")[1]);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Skills
        </h3>
        <button
          onClick={addSkillCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
        >
          Add Skill
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={skills.map((_, index) => `category-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          {skills.map((skill, index) => (
            <SortableSkillCategoryItem
              key={`skill-${index}`}
              skill={skill}
              index={index}
              editingId={editingId}
              setEditingId={setEditingId}
              updateSkill={updateSkillCategory}
              removeSkill={removeSkillCategory}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PortfolioSkills;
