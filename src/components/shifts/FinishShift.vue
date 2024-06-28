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
        Finalizar Turno
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Finalizar Turno</AlertDialogTitle>
        <AlertDialogDescription>
            <form>
                <div class="grid items-center w-full gap-4">
                    <div class="flex flex-col space-y-1.5">
                        <Label for="name">Username</Label>
                        <Input id="name" />
                    </div>
                </div>                                
                <div class="grid items-center w-full gap-4">
                    <div class="flex flex-col space-y-1.5">
                        <Label for="">Ganancia por plataforma:</Label>
                        <FormItem>
                            <FormLabel>Facebook</FormLabel>
                                <FormControl>
                                    <Input type="number" />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                        <FormItem>
                            <FormLabel>Instagram</FormLabel>
                                <FormControl>
                                    <Input type="number" />
                                </FormControl>
                            <FormMessage />
                        </FormItem>                        
                        <FormItem>
                            <FormLabel>Tiktok</FormLabel>
                                <FormControl>
                                    <Input type="number" />
                                </FormControl>
                            <FormMessage />
                        </FormItem>
                    </div>
                </div>
            </form>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction>Terminar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
</AlertDialog>
</template>