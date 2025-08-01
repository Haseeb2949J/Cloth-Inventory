"use client"

import type React from "react"

import { useState } from "react"
import { supabase, type ClothItem } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ClothSectionProps {
  title: string
  category: "fresh" | "wearing" | "dirty"
  clothes: ClothItem[]
  onUpdate: () => void
}

export function ClothSection({ title, category, clothes, onUpdate }: ClothSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ClothItem | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    color: "",
    type: "",
    brand: "",
    size: "",
    notes: "",
  })
  const { toast } = useToast()

  const resetForm = () => {
    setFormData({
      name: "",
      color: "",
      type: "",
      brand: "",
      size: "",
      notes: "",
    })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from("clothes").insert([
      {
        ...formData,
        category,
        user_id: user.id,
      },
    ])

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add item",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Item added successfully",
      })
      resetForm()
      setIsAddDialogOpen(false)
      onUpdate()
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return

    const { error } = await supabase.from("clothes").update(formData).eq("id", editingItem.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Item updated successfully",
      })
      setEditingItem(null)
      resetForm()
      onUpdate()
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("clothes").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Item deleted successfully",
      })
      onUpdate()
    }
  }

  const handleMoveItem = async (item: ClothItem, newCategory: "fresh" | "wearing" | "dirty") => {
    const { error } = await supabase.from("clothes").update({ category: newCategory }).eq("id", item.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to move item",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: `Item moved to ${newCategory}`,
      })
      onUpdate()
    }
  }

  const openEditDialog = (item: ClothItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      color: item.color || "",
      type: item.type || "",
      brand: item.brand || "",
      size: item.size || "",
      notes: item.notes || "",
    })
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "fresh":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "wearing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "dirty":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              <Badge className={getCategoryColor(category)}>{clothes.length}</Badge>
            </CardTitle>
            <CardDescription>
              {category === "fresh" && "Clean clothes ready to wear"}
              {category === "wearing" && "Currently wearing these items"}
              {category === "dirty" && "Items that need washing"}
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>Add a new clothing item to {title.toLowerCase()}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shirt">Shirt</SelectItem>
                        <SelectItem value="pants">Pants</SelectItem>
                        <SelectItem value="dress">Dress</SelectItem>
                        <SelectItem value="jacket">Jacket</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="underwear">Underwear</SelectItem>
                        <SelectItem value="socks">Socks</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Item
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {clothes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No items in this category</p>
          ) : (
            clothes.map((item) => (
              <Card key={item.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex gap-2 mt-1">
                      {item.type && <Badge variant="outline">{item.type}</Badge>}
                      {item.color && <Badge variant="outline">{item.color}</Badge>}
                      {item.size && <Badge variant="outline">Size {item.size}</Badge>}
                    </div>
                    {item.brand && <p className="text-sm text-muted-foreground mt-1">{item.brand}</p>}
                    {item.notes && <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>}
                  </div>
                  <div className="flex gap-1">
                    {category !== "wearing" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveItem(item, "wearing")}
                        title="Move to wearing"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                    {category !== "dirty" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveItem(item, "dirty")}
                        title="Move to dirty"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                    {category !== "fresh" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMoveItem(item, "fresh")}
                        title="Move to fresh"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => openEditDialog(item)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>Update the details of this clothing item</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shirt">Shirt</SelectItem>
                      <SelectItem value="pants">Pants</SelectItem>
                      <SelectItem value="dress">Dress</SelectItem>
                      <SelectItem value="jacket">Jacket</SelectItem>
                      <SelectItem value="shoes">Shoes</SelectItem>
                      <SelectItem value="underwear">Underwear</SelectItem>
                      <SelectItem value="socks">Socks</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Color</Label>
                  <Input
                    id="edit-color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Brand</Label>
                  <Input
                    id="edit-brand"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-size">Size</Label>
                  <Input
                    id="edit-size"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">
                Update Item
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
