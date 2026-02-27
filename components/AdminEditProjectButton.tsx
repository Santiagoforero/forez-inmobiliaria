"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Props = {
  projectId: string;
};

export function AdminEditProjectButton({ projectId }: Props) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!mounted) return;
        if (data.user?.email === "forezinmobiliaria@gmail.com") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      })
      .catch(() => {
        if (mounted) setIsAdmin(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <Button
      asChild
      variant="outline"
      className="mt-4 border-sky-500 text-xs font-semibold text-sky-800 hover:bg-sky-50"
    >
      <Link href={`/proyectos/publicar?edit=${projectId}`}>Editar este proyecto</Link>
    </Button>
  );
}

