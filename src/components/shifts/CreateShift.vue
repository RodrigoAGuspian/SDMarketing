<script setup lang='ts'>
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
</script>

<template>
<AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="outline">
        Crear Turno
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Crear Turno</AlertDialogTitle>
        <AlertDialogDescription>
            <form>
                <div class="grid items-center w-full gap-4 mb-4">
                    <div class="flex flex-col space-y-1.5">
                        <Label for="username">Username</Label>
                        <Input id="username" />
                    </div>
                </div>
            </form>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction>Crear</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
</template>