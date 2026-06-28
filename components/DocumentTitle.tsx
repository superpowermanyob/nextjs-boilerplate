"use client";

import { useEffect } from "react";

import { useI18n } from "@/components/I18nProvider";

type DocumentTitleProps = {
  title?: string;
  description?: string;
};

export function DocumentTitle({ title, description }: DocumentTitleProps) {
  const { t, format } = useI18n();

  useEffect(() => {
    document.title = title ?? t.meta.title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description ?? t.meta.description,
      );
    }
  }, [title, description, t, format]);

  return null;
}
