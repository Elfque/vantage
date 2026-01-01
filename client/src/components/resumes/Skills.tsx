"use client";

import React, { useState, memo } from "react";
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
import { FaGripVertical, FaRegTrashAlt } from "react-icons/fa";
import { ResumeSkill } from "@/types/resume";
import Input from "../Input";

const SortableSkillItem = memo(
  ({
    skill,
    editingId,
    setEditingId,
    updateSkill,
    removeSkill,
  }: {
    skill: ResumeSkill;
    editingId: number | null;
    setEditingId: (id: number | null) => void;
    updateSkill: (
      id: number,
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    removeSkill: (id: number) => void;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({
        id: skill.id,
        disabled: editingId === skill.id,
      });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2 mb-2"
      >
        <div
          {...listeners}
          className="cursor-move text-gray-400 hover:text-gray-600 flex items-center"
        >
          <FaGripVertical className="-translate-y-2 text-2xl" />
        </div>

        <Input
          name="name"
          value={skill.name}
          placeholder="Skill name"
          onFocus={() => setEditingId(skill.id)}
          onBlur={() => setEditingId(null)}
          onChange={(e) => updateSkill(skill.id, e)}
        />

        {/* <Select
          name="level"
          value={skill.level}
          onFocus={() => setEditingId(skill.id)}
          onBlur={() => setEditingId(null)}
          onChange={(e) => updateSkill(skill.id, e)}
          options={[
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced", value: "advanced" },
          ]}
        /> */}

        <button
          onClick={() => removeSkill(skill.id)}
          className="text-red-600 hover:text-red-800"
        >
          <FaRegTrashAlt />
        </button>
      </div>
    );
  }
);

SortableSkillItem.displayName = "SortableSkillItem";

type SkillsProps = {
  skills: ResumeSkill[];
  setSkills: React.Dispatch<React.SetStateAction<ResumeSkill[]>>;
};

export default function Skills({ skills, setSkills }: SkillsProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setSkills((prev) => {
      const oldIndex = prev.findIndex((s) => s.id === active.id);
      const newIndex = prev.findIndex((s) => s.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const updateSkill = (
    id: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, [name]: value } : skill
      )
    );
  };

  const removeSkill = (id: number) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const addSkill = () => {
    setSkills((prev) => [
      ...prev,
      { id: Date.now(), name: "", level: "", isNew: true },
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Skills
        </h3>
        <button
          onClick={addSkill}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm cursor-pointer"
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
          items={skills.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {skills.map((skill) => (
            <SortableSkillItem
              key={skill.id}
              skill={skill}
              editingId={editingId}
              setEditingId={setEditingId}
              updateSkill={updateSkill}
              removeSkill={removeSkill}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
