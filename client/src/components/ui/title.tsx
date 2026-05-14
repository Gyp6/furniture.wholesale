interface Props{
    title: string;
}

export function BundlesTitleSection ({ title }: Props) {
    return (
        <h2 className={'text-2xl text-muted-foreground font-semibold'}>
        {title}
        </h2>
    )
    
}