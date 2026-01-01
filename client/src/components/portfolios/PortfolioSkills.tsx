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

const SortableSkillCategoryItem = memo(
  ({
    skillCategory,
    index,
    editingId,
    setEditingId,
    updateSkillCategory,
    removeSkillCategory,
  }: {
    skillCategory: PortfolioSkill;
    index: number;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    updateSkillCategory: (
      index: number,
      field: string,
      value: string | string[]
    ) => void;
    removeSkillCategory: (index: number) => void;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: `category-${index}`,
        disabled: editingId === `category-${index}`,
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const addSkill = () => {
      const newSkills = [...skillCategory.skills, ""];
      updateSkillCategory(index, "skills", newSkills);
    };

    const updateSkill = (skillIndex: number, value: string) => {
      const newSkills = [...skillCategory.skills];
      newSkills[skillIndex] = value;
      updateSkillCategory(index, "skills", newSkills);
    };

    const removeSkill = (skillIndex: number) => {
      const newSkills = skillCategory.skills.filter((_, i) => i !== skillIndex);
      updateSkillCategory(index, "skills", newSkills);
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-grab active:cursor-grabbing"
            >
              <FaGripVertical />
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Category {index + 1}
            </span>
          </div>
          <button
            onClick={() => removeSkillCategory(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FaRegTrashAlt />
          </button>
        </div>

        <div className="space-y-3">
          <Input
            type="text"
            label="Category Name"
            placeholder="e.g., Frontend, Backend, Tools"
            value={skillCategory.category}
            onFocus={() => setEditingId(`category-${index}`)}
            onBlur={() => setEditingId(null)}
            onChange={(e) =>
              updateSkillCategory(index, "category", e.target.value)
            }
          />

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills
              </label>
              <button
                onClick={addSkill}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                <FaPlus className="text-xs" />
                Add Skill
              </button>
            </div>
            {skillCategory.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Skill name"
                  value={skill}
                  onFocus={() => setEditingId(`category-${index}`)}
                  onBlur={() => setEditingId(null)}
                  onChange={(e) => updateSkill(skillIndex, e.target.value)}
                />
                <button
                  onClick={() => removeSkill(skillIndex)}
                  className="text-red-500 hover:text-red-700 mt-2"
                >
                  <FaRegTrashAlt />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
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
    })
  );

  const addSkillCategory = () => {
    setSkills((prev) => [
      ...prev,
      {
        category: "",
        skills: [""],
        isNew: true,
      },
    ]);
  };

  const updateSkillCategory = (
    index: number,
    field: string,
    value: string | string[]
  ) => {
    setSkills((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, [field]: value } : cat))
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
          Add Category
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
          {skills.map((skillCategory, index) => (
            <SortableSkillCategoryItem
              key={`category-${index}`}
              skillCategory={skillCategory}
              index={index}
              editingId={editingId}
              setEditingId={setEditingId}
              updateSkillCategory={updateSkillCategory}
              removeSkillCategory={removeSkillCategory}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default PortfolioSkills;
