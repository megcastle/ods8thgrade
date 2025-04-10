import {
    Tailwind,
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Text,
    Font,
} from '@react-email/components'

const FormSubmissionEmail = ({ parentName }) => {
    return (
        <Html>
            <Tailwind>
                <Head>
                    <title>ODS 8th Grade Dance Slideshow: Thank you for your submission</title>
                    <Font
                        fontFamily="Inter"
                        fallbackFontFamily="Arial"
                        webFont={{
                            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
                            format: 'woff2',
                        }}
                        fontWeight={400}
                        fontStyle="normal"
                    />
                </Head>
                <Preview>text</Preview>
                <Body className="bg-[#e5e5e3] py-10 font-['Inter',Arial,sans-serif]">
                    <Container className="mx-auto max-w-[600px] text-center">
                        {/* Email content here */}
                        <Heading className="my-8 font-['Inter',Arial,sans-serif] text-5xl font-extrabold uppercase leading-tight tracking-tight text-[#333333]">
                            {parentName}
                        </Heading>

                        {/* More content... */}

                        <Section className="my-10">
                            <Link
                                href={downloadUrl}
                                className="inline-block rounded-full bg-[#333333] px-10 py-4 text-base font-semibold uppercase text-white no-underline"
                            >
                                link
                            </Link>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}

export default FormSubmissionEmail
