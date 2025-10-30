import Link from 'next/link'
import { LogOut, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type UserMenuProps = {
  onClickSignIn: () => void
  onClickRegister: () => void
  onLogout: () => void
  tokens?: {
    accessToken: string
  }
  user?: {
    name: string
    picture: string
    email: string
    channelTitle: string
  }
}

export const UserMenu = ({
  onClickSignIn,
  onClickRegister,
  onLogout,
  tokens,
  user,
}: UserMenuProps) => {
  const initials = user?.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="h-10 w-full max-w-[200px] flex items-center justify-end">
      {tokens && user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button
              variant="ghost"
              className={`relative h-10 w-10 rounded-full`}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.picture} alt={user.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.channelTitle}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/upload" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload Video</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            onClick={onClickSignIn}
            className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Sign in
          </Button>
          <Button onClick={onClickRegister} className="cursor-pointer">
            Create account
          </Button>
        </div>
      )}
    </div>
  )
}
