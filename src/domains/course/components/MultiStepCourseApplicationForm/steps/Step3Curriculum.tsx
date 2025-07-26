"use client";

import React from "react";
import { Control } from "react-hook-form";
import { CurriculumFields } from "../../form-fields/CurriculumFields";
import type { CourseApplicationFormData } from "../../../types";

interface Step3CurriculumProps {
  control: Control<CourseApplicationFormData>;
}

export function Step3Curriculum({ control }: Step3CurriculumProps) {
  return <CurriculumFields control={control} />;
}
