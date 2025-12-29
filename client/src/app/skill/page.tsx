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

// ---------------- types ----------------
type Skill = {
  id: number;
  name: string;
  level: string;
};

// ---------------- Input (forwarded) ----------------
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={`border px-2 py-1 rounded w-full ${props.className ?? ""}`}
    />
  );
});
Input.displayName = "Input";

// ---------------- Sortable Item ----------------
const SortableSkillItem = memo(
  ({
    skill,
    editingId,
    setEditingId,
    updateSkill,
    removeSkill,
  }: {
    skill: Skill;
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
        className="grid grid-cols-[2rem_1fr_1fr_2rem] items-center gap-2 mb-2"
      >
        <div
          {...listeners}
          className="cursor-move text-gray-400 hover:text-gray-600"
        >
          <FaGripVertical />
        </div>

        <Input
          name="name"
          value={skill.name}
          placeholder="Skill name"
          onFocus={() => setEditingId(skill.id)}
          onBlur={() => setEditingId(null)}
          onChange={(e) => updateSkill(skill.id, e)}
        />

        <select
          name="level"
          value={skill.level}
          onFocus={() => setEditingId(skill.id)}
          onBlur={() => setEditingId(null)}
          onChange={(e) => updateSkill(skill.id, e)}
          className="border px-2 py-1 rounded"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

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

// ---------------- Parent ----------------
export default function SkillsEditor() {
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: "React", level: "advanced" },
    { id: 2, name: "TypeScript", level: "intermediate" },
    { id: 3, name: "CSS", level: "advanced" },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 👈 important
      },
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* 🔴 MUST be ids only */}
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
  );
}
