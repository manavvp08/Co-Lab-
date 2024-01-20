import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"

const ComingSoon = ({
    component
}: {
    component: React.ReactNode
}) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {component}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle className="text-center">Coming Soon!</DrawerTitle>
                        <DrawerDescription className="text-center">This feature will be available in our future releases!</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" className="bg-indigo-600 dark:text-white hover:bg-indigo-700 text-white hover:text-white">Okay</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ComingSoon;