"use client";

import React from "react";
import {
  useFieldArray,
  Control,
  FieldValues,
  PathValue,
  FieldArray,
  FieldArrayPath,
  UseFieldArrayReturn,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

// 더 정확한 타입 추론을 위한 helper type
type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

interface DynamicListFieldProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldArrayPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TFieldName;
  label: string;
  description?: string;
  minItems?: number;
  maxItems?: number;
  renderItem: (
    field: FieldArray<TFieldValues, TFieldName>,
    index: number,
    fieldArrayReturn: UseFieldArrayReturn<TFieldValues, TFieldName>,
  ) => React.ReactNode;
  newItemTemplate: () => ArrayElement<PathValue<TFieldValues, TFieldName>>;
  className?: string;
}

export function DynamicListField<
  TFieldValues extends FieldValues,
  TFieldName extends FieldArrayPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  minItems = 1,
  maxItems,
  renderItem,
  newItemTemplate,
  className,
}: DynamicListFieldProps<TFieldValues, TFieldName>) {
  const fieldArrayReturn = useFieldArray({
    control,
    name,
  });

  const { fields, append, remove, move } = fieldArrayReturn;

  const handleAdd = () => {
    if (!maxItems || fields.length < maxItems) {
      append(newItemTemplate());
    }
  };

  const handleRemove = (index: number) => {
    if (fields.length > minItems) {
      remove(index);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      move(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      move(index, index + 1);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">{label}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={maxItems ? fields.length >= maxItems : false}
        >
          <Plus className="mr-2 h-4 w-4" />
          추가
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <GripVertical className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === fields.length - 1}
                  >
                    <GripVertical className="h-4 w-4 rotate-180" />
                  </Button>
                </div>

                <div className="flex-1">
                  {renderItem(field, index, fieldArrayReturn)}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleRemove(index)}
                  disabled={fields.length <= minItems}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-md">
          아직 항목이 없습니다. 위의 &quot;추가&quot; 버튼을 클릭해주세요.
        </div>
      )}

      {minItems > 0 && fields.length < minItems && (
        <p className="text-sm text-destructive">
          최소 {minItems}개 이상의 항목이 필요합니다.
        </p>
      )}
    </div>
  );
}
