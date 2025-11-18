import React from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemGroup } from '@/components/ui/item'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

type Props = {
  onBack: () => void
}

export default function ComponentLibrary({ onBack }: Props) {
  const [progressValue, setProgressValue] = React.useState(45)

  const increaseProgress = () => setProgressValue(prev => Math.min(prev + 5, 100))
  const decreaseProgress = () => setProgressValue(prev => Math.max(prev - 5, 0))

  const sections = [
    { id: 'button', label: 'Button' },
    { id: 'button-group', label: 'Button Group' },
    { id: 'accordion', label: 'Accordion' },
    { id: 'collapsible', label: 'Collapsible' },
    { id: 'item', label: 'Item' },
    { id: 'progress', label: 'Progress' },
    { id: 'separator', label: 'Separator' },
    { id: 'slider', label: 'Slider' },
    { id: 'switch', label: 'Switch' },
    { id: 'table', label: 'Table' },
    { id: 'badge', label: 'Badge' },
    { id: 'card', label: 'Card' },
    { id: 'checkbox', label: 'Checkbox' },
    { id: 'icon-library', label: 'Icon Library' },
  ]

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex relative min-h-screen">
      {/* Fixed left sidebar */}
      <nav className="fixed left-0 top-0 w-48 h-screen bg-gray-900 border-r border-gray-700 overflow-y-auto p-4 pt-8 z-40">
        <h3 className="text-sm font-semibold text-white mb-4">Sections</h3>
        <ul className="space-y-2">
          {sections.map(section => (
            <li key={section.id}>
              <button
                onClick={() => scrollToSection(section.id)}
                className="w-full text-left text-sm px-3 py-2 rounded hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <div className="ml-48 w-full p-8">
        <div className="max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">Component Library</h2>
            <Button variant="secondary" onClick={onBack}>Back</Button>
          </div>

          <section id="button" className="mb-8">
            <h3 className="font-medium mb-2">Button</h3>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Styles</h4>
              <p className="text-sm text-muted-foreground mb-3">Demonstrates the visual styles/variants for buttons.</p>
              <p className="text-sm text-muted-foreground mb-3">Buttons are clickable! If we are only displaying info, I would recommend the badge component.</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-start gap-2">
                  <span className="text-xs font-medium">Default</span>
                  <Button variant="default">Default</Button>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-xs font-medium">Secondary</span>
                  <Button variant="secondary">Secondary</Button>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-xs font-medium">Dark</span>
                  <Button variant="dark">Dark</Button>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-xs font-medium">Destructive</span>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-xs font-medium">Status</span>
                  <Button variant="status">Status</Button>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-xs font-medium">Ghost</span>
                  <Button variant="ghost">Ghost</Button>
                </div>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-xs font-medium">Link</span>
                  <Button variant="link">Link</Button>
                </div>
              </div>
            </div>
            <Separator className="my-6" />

              <div className="mb-6">
              <h4 className="font-medium mb-2">Sizes</h4>
              <p className="text-sm text-muted-foreground mb-3">Spacing and sizing variants for buttons.</p>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs">Small</span>
                  <Button size="sm">Small</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs">Default</span>
                  <Button size="default">Default</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs">Large</span>
                  <Button size="lg">Large</Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs">Icon</span>
                  <Button size="icon" aria-label="icon-sample">
                    <svg className="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs">Icon-sm</span>
                  <Button size="icon-sm" aria-label="icon-sample-sm">
                    <svg className="size-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </Button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs">Icon-lg</span>
                  <Button size="icon-lg" aria-label="icon-sample-lg">
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <h4 className="font-medium mb-2">Icon Examples</h4>
              <p className="text-sm text-muted-foreground mb-3">Examples: icon-only, leading icon, trailing icon.</p>
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs">Icon-only</span>
                  <Button size="icon" aria-label="star">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs">Leading icon</span>
                  <Button leadingIcon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  }>
                    Leading
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs">Trailing icon</span>
                  <Button trailingIcon={
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  }>
                    Trailing
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section id="button-group" className="mb-8">
            <h3 className="font-medium mb-2">Button Group</h3>
            <p className="text-sm text-muted-foreground mb-3">Follows the button variants, can be horizontal or vertical.</p>
            <div className="mb-4">
              <ButtonGroup>
                <Button>First</Button>
                <Button>Second</Button>
                <Button>Third</Button>
              </ButtonGroup>
            </div>
            <div>
              <ButtonGroup orientation="vertical">
                <Button>Top</Button>
                <Button>Middle</Button>
                <Button>Bottom</Button>
              </ButtonGroup>
            </div>
            <Separator className="my-6" />

            <h4 className="font-medium mb-2">Variants</h4>
            <p className="text-sm text-muted-foreground mb-3">Examples of `ButtonGroup` with each visual variant.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium">Default</span>
                <ButtonGroup variant="default">
                  <Button>One</Button>
                  <Button>Two</Button>
                  <Button>Three</Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium">Destructive</span>
                <ButtonGroup variant="destructive">
                  <Button>Delete</Button>
                  <Button>Confirm</Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium">Status</span>
                <ButtonGroup variant="status">
                  <Button>Left</Button>
                  <Button>Center</Button>
                  <Button>Right</Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium">Secondary</span>
                <ButtonGroup variant="secondary">
                  <Button>Opt A</Button>
                  <Button>Opt B</Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium">Ghost</span>
                <ButtonGroup variant="ghost">
                  <Button>G1</Button>
                  <Button>G2</Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium">Dark</span>
                <ButtonGroup variant="dark">
                  <Button>Dark A</Button>
                  <Button>Dark B</Button>
                </ButtonGroup>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium">Link</span>
                <ButtonGroup variant="link">
                  <Button>Help</Button>
                  <Button>Docs</Button>
                </ButtonGroup>
              </div>
            </div>
          </section>

          <section id="accordion" className="mb-8">
            <h3 className="font-medium mb-2">Accordion</h3>
            <p className="text-sm text-muted-foreground mb-3">Good for dropdowns. By default, only one item can be expanded at a time.</p>
            <div className="mb-6">
              <h4 className="font-medium mb-2">Arrow Left (Default)</h4>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger arrowPosition="left">ITEM 1</AccordionTrigger>
                  <AccordionContent value="75%">Content item 1</AccordionContent>
                  <AccordionContent value="egg">Content item 2</AccordionContent>
                  <AccordionContent value="8">Content item 3</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger arrowPosition="left">ITEM 2</AccordionTrigger>
                  <AccordionContent>Content item 2</AccordionContent>
                  <AccordionContent>Content item 2</AccordionContent>
                  <AccordionContent>Content item 3</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger arrowPosition="left">ITEM 3</AccordionTrigger>
                  <AccordionContent value="2.5GB">Content item 3</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <Separator className="my-6" />

            <div>
              <h4 className="font-medium mb-2">Arrow Right</h4>
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger arrowPosition="right">ITEM 1</AccordionTrigger>
                  <AccordionContent value="75%">Content item 1</AccordionContent>
                  <AccordionContent value="egg">Content item 2</AccordionContent>
                  <AccordionContent value="8">Content item 3</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger arrowPosition="right">ITEM 2</AccordionTrigger>
                  <AccordionContent>Content item 2</AccordionContent>
                  <AccordionContent>Content item 2</AccordionContent>
                  <AccordionContent>Content item 3</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger arrowPosition="right">ITEM 3</AccordionTrigger>
                  <AccordionContent>Content item 3</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </section>

          <section id="progress" className="mb-8">
            <h3 className="font-medium mb-2">Progress</h3>
            <p className="text-sm text-muted-foreground mb-3">The buttons are not part of the progress component! Just for demo.</p>
            <div className="max-w-sm">
              <Progress value={progressValue} />
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={decreaseProgress} variant="secondary">- 5</Button>
              <span className="px-4 py-2 text-sm font-medium">{progressValue}%</span>
              <Button onClick={increaseProgress} variant="secondary">+ 5</Button>
            </div>
          </section>

          <section id="separator" className="mb-8">
            <h3 className="font-medium mb-2">Separator</h3>
            <div className="mb-2">Above</div>
            <Separator />
            <div className="mt-2">Below</div>
          </section>

          <section id="slider" className="mb-8">
            <h3 className="font-medium mb-2">Slider</h3>
            <div className="max-w-md">
              <Slider defaultValue={[25]} />
            </div>
          </section>

          <section id="switch" className="mb-8">
            <h3 className="font-medium mb-2">Switch</h3>
            <Switch />
          </section>

          <section id="table" className="mb-8">
            <h3 className="font-medium mb-2">Table</h3>
            <p className="text-sm text-muted-foreground mb-3">Note this table was formatted with 2 columns in mind. Adding more columns may cause it to explode.</p>
            <p className="text-sm text-muted-foreground mb-3">In future, we can consider adding support for some rows being accordions/expandable.</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Col A</TableHead>
                  <TableHead>Col B</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Row 1 A</TableCell>
                  <TableCell>Row 1 B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Row 2 A</TableCell>
                  <TableCell>Row 2 B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Row 3 A</TableCell>
                  <TableCell>Row 3 B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Row 4 A</TableCell>
                  <TableCell>Row 4 B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Row 5 A</TableCell>
                  <TableCell>Row 5 B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Row 6 A</TableCell>
                  <TableCell>Row 6 B</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Row 7 A</TableCell>
                  <TableCell>Row 7 B</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>

          <section id="badge" className="mb-8">
            <h3 className="font-medium mb-2">Badge</h3>
            <p className="text-sm text-muted-foreground mb-3">We need to add support for nesting badges, adding leading/trailing icons, and potentially a badge group component.</p>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="dark">Dark</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="selected">Selected</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </section>

          <Separator />

          <section id="card" className="mb-8">
            <h3 className="font-medium mb-2">Card</h3>
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>This is a card description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the main content of the card. I think we are only really using the card part, without anything in it.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
          </section>

          <Separator />

          <section id="checkbox" className="mb-8">
            <h3 className="font-medium mb-2">Checkbox</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="checkbox-1" />
                <label htmlFor="checkbox-1" className="text-sm cursor-pointer">Checkbox option 1</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="checkbox-2" />
                <label htmlFor="checkbox-2" className="text-sm cursor-pointer">Checkbox option 2</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="checkbox-3" defaultChecked />
                <label htmlFor="checkbox-3" className="text-sm cursor-pointer">Checkbox option 3 (checked)</label>
              </div>
            </div>
          </section>

          <Separator />

          
          <section id="collapsible" className="mb-8">
            <h3 className="font-medium mb-2">Collapsible</h3>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button>Toggle Collapsible</Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2 p-4 border">Hidden content inside a collapsible. This component has not been formatted.</CollapsibleContent>
            </Collapsible>
          </section>

          <section id="item" className="mb-8">
            <h3 className="font-medium mb-2">Item</h3>
            <p className="text-sm text-muted-foreground mb-3">This has not been formatted.</p>
            <ItemGroup>
              <Item>
                <ItemMedia variant="icon">📁</ItemMedia>
                <ItemContent>
                  <ItemTitle>Item default</ItemTitle>
                  <ItemDescription>Description for item</ItemDescription>
                </ItemContent>
              </Item>
              <Item variant="outline" size="sm">
                <ItemMedia variant="image"><img src="/rover_logo_redbg.svg" alt="logo"/></ItemMedia>
                <ItemContent>
                  <ItemTitle>Item outline small</ItemTitle>
                  <ItemDescription>Smaller item</ItemDescription>
                </ItemContent>
              </Item>
            </ItemGroup>
          </section>

          <section id="icon-library" className="mb-8">
            <h3 className="font-medium mb-2">Icon Library</h3>
            <div className="grid grid-cols-3 gap-8 sm:grid-cols-5 md:grid-cols-6">
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_battery.svg" alt="icon_battery" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_battery</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" aria-label="camera">
              <img src="/icons/icon_button_camera.svg" alt="icon_button_camera" className="w-4 h-4" />
            </Button>
            <span className="text-xs text-center break-words">icon_button_camera</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" aria-label="display">
              <img src="/icons/icon_button_display.svg" alt="icon_button_display" className="w-4 h-4" />
            </Button>
            <span className="text-xs text-center break-words">icon_button_display</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" aria-label="minus">
              <img src="/icons/icon_button_minus.svg" alt="icon_button_minus" className="w-4 h-4" />
            </Button>
            <span className="text-xs text-center break-words">icon_button_minus</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" aria-label="plus">
              <img src="/icons/icon_button_plus.svg" alt="icon_button_plus" className="w-4 h-4" />
            </Button>
            <span className="text-xs text-center break-words">icon_button_plus</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" aria-label="record">
              <img src="/icons/icon_button_record.svg" alt="icon_button_record" className="w-4 h-4" />
            </Button>
            <span className="text-xs text-center break-words">icon_button_record</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" aria-label="refresh">
              <img src="/icons/icon_button_refresh.svg" alt="icon_button_refresh" className="w-4 h-4" />
            </Button>
            <span className="text-xs text-center break-words">icon_button_refresh</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" aria-label="scale">
              <img src="/icons/icon_button_scale.svg" alt="icon_button_scale" className="w-4 h-4" />
            </Button>
            <span className="text-xs text-center break-words">icon_button_scale</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_charge.svg" alt="icon_charge" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_charge</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_circle_green.svg" alt="icon_circle_green" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_circle_green</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_circle_grey.svg" alt="icon_circle_grey" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_circle_grey</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_circle_orange.svg" alt="icon_circle_orange" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_circle_orange</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_circle_red.svg" alt="icon_circle_red" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_circle_red</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Button size="icon" aria-label="camera">
              <img src="/icons/icon_clock.svg" alt="icon_clock" className="w-4 h-4" />
            </Button>
            <span className="text-xs text-center break-words">icon_clock</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_cycle.svg" alt="icon_cycle" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_cycle</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_displacement.svg" alt="icon_displacement" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_displacement</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_distance.svg" alt="icon_distance" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_distance</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_download.svg" alt="icon_download" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_download</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_energy.svg" alt="icon_energy" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_energy</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_fault.svg" alt="icon_fault" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_fault</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_input.svg" alt="icon_input" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_input</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_laptop.svg" alt="icon_laptop" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_laptop</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_motor.svg" alt="icon_motor" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_motor</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_network.svg" alt="icon_network" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_network</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_speed.svg" alt="icon_speed" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_speed</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_temperature.svg" alt="icon_temperature" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_temperature</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_triangle_up_red.svg" alt="icon_triangle_up_red" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_triangle_up_red</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_voltage.svg" alt="icon_voltage" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_voltage</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_edit.svg" alt="icon_edit" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_edit</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src="/icons/icon_delete.svg" alt="icon_delete" className="w-8 h-8" />
            <span className="text-xs text-center break-words">icon_delete</span>
          </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
